import { Briefcase, Users } from "lucide-react";
import { getAdminStore } from "@/lib/server/admin-store";
import { ServiceForm, ServiceRow } from "../../_components/service-editor";
import { TeamMemberForm, TeamMemberRow } from "../../_components/team-editor";
import { EmptyState, PageHeader, SectionHeader } from "../../_components/primitives";
import { requireAdmin } from "../../_lib/require-admin";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  await requireAdmin();

  const store = await getAdminStore();
  const teamMembers = store.siteSettings.teamMembers ?? [];
  const services = store.services;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Танилцуулга"
        title="Баг ба үйлчилгээ"
        description="Багийн гишүүд „Бидний тухай“ хуудсанд, үйлчилгээнүүд нүүр хуудсанд харагдана."
        actions={
          <span className="text-sm font-semibold text-[var(--muted-foreground)]">
            {teamMembers.length} гишүүн · {services.length} үйлчилгээ
          </span>
        }
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader title="Багийн гишүүд" />
          {teamMembers.length === 0 ? (
            <EmptyState icon={Users} title="Багийн гишүүн алга" message="Доорх маягтаар эхний гишүүнээ нэмнэ үү." />
          ) : (
            teamMembers.map((member) => <TeamMemberRow key={member.id} member={member} />)
          )}
          <h3 className="pt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Шинэ гишүүн нэмэх
          </h3>
          <TeamMemberForm />
        </section>

        <section className="space-y-4">
          <SectionHeader title="Үйлчилгээнүүд" />
          {services.length === 0 ? (
            <EmptyState icon={Briefcase} title="Үйлчилгээ алга" message="Доорх маягтаар эхний үйлчилгээгээ нэмнэ үү." />
          ) : (
            services.map((service) => <ServiceRow key={service.id} service={service} />)
          )}
          <h3 className="pt-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
            Шинэ үйлчилгээ нэмэх
          </h3>
          <ServiceForm />
        </section>
      </div>
    </div>
  );
}
