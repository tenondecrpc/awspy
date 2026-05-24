import { RegisterTemplate } from "@/components/templates/RegisterTemplate";
import { currentEdition, getEdition } from "@/lib/content/editions";
import { buildPageMetadata } from "@/lib/utils/seo";

export async function generateMetadata() {
  return buildPageMetadata({
    title: "Registro",
    description:
      "Registrate gratis para asistir al AWS Community Day Paraguay.",
    path: "/register",
  });
}

export default function RegisterPage() {
  const year = currentEdition();
  const { eventInfo } = getEdition(year);
  return <RegisterTemplate eventInfo={eventInfo} />;
}
