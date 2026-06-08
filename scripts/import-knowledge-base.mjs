import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";

const SOURCE_FILE = "Nomadabe_Travel_Knowledge_Base.md";
const TABLE_NAME = "knowledge_base";
const execFileAsync = promisify(execFile);

await loadEnvFile(".env.local");

const isDryRun = process.argv.includes("--dry-run");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sourcePath = path.join(process.cwd(), SOURCE_FILE);

const markdown = await readMarkdownFile(sourcePath);
const chunks = chunkMarkdown(markdown).map((chunk, index) => ({
  source_file: SOURCE_FILE,
  title: chunk.title,
  content: chunk.content,
  chunk_index: index,
  metadata: {
    heading_level: chunk.headingLevel,
    imported_from: "scripts/import-knowledge-base.mjs",
  },
}));

if (chunks.length === 0) {
  throw new Error(`No content chunks found in ${SOURCE_FILE}.`);
}

if (isDryRun) {
  console.log(`Dry run: ${chunks.length} chunks prepared from ${SOURCE_FILE}.`);
  for (const chunk of chunks) {
    console.log(`${chunk.chunk_index + 1}. ${chunk.title} (${chunk.content.length} chars)`);
  }
  process.exit(0);
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local."
  );
}

const apiBaseUrl = `${normalizeSupabaseProjectUrl(supabaseUrl)}/rest/v1/${TABLE_NAME}`;
const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

await deleteExistingRows(apiBaseUrl, headers);
await insertRows(apiBaseUrl, headers, chunks);

console.log(`Imported ${chunks.length} chunks into Supabase table "${TABLE_NAME}".`);

async function loadEnvFile(fileName) {
  try {
    const envFile = await readFile(path.join(process.cwd(), fileName), "utf8");

    for (const line of envFile.split("\n")) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [rawKey, ...rawValueParts] = trimmed.split("=");
      const key = rawKey.trim();
      const value = rawValueParts
        .join("=")
        .trim()
        .replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function readMarkdownFile(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code !== "ETIMEDOUT") {
      throw error;
    }

    const { stdout } = await execFileAsync("cat", [filePath], {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    });

    return stdout;
  }
}

function normalizeSupabaseProjectUrl(value) {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/\/rest\/v1\/?$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}

function chunkMarkdown(markdown) {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  const sections = normalized.split(/\n(?=##\s+)/g);

  const chunks = sections
    .map((section) => {
      const content = section.trim();
      const headingMatch = content.match(/^(#{2,6})\s+(.+)$/m);

      return {
        title: headingMatch?.[2]?.trim() ?? SOURCE_FILE,
        headingLevel: headingMatch?.[1]?.length ?? 0,
        content,
      };
    })
    .filter((section) => section.content.length > 0);

  return mergeTinyChunks(chunks);
}

function mergeTinyChunks(chunks) {
  const merged = [];

  for (const chunk of chunks) {
    if (chunk.content.length < 120 && chunks.length > 1) {
      const nextChunk = chunks[chunks.indexOf(chunk) + 1];

      if (nextChunk) {
        nextChunk.title = `${chunk.title} / ${nextChunk.title}`;
        nextChunk.content = `${chunk.content}\n\n${nextChunk.content}`;
        continue;
      }
    }

    merged.push(chunk);
  }

  return merged;
}

async function deleteExistingRows(apiBaseUrl, headers) {
  const response = await fetch(
    `${apiBaseUrl}?source_file=eq.${encodeURIComponent(SOURCE_FILE)}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status} ${await response.text()}`);
  }
}

async function insertRows(apiBaseUrl, headers, rows) {
  const response = await fetch(apiBaseUrl, {
    method: "POST",
    headers: {
      ...headers,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`Insert failed: ${response.status} ${await response.text()}`);
  }
}
