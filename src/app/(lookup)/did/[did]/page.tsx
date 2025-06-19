import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ did: string }>;
}

export default async function InfoScreen({ params }: Props) {
  const { did } = await params;
  redirect(`/at/${did}`);
}
