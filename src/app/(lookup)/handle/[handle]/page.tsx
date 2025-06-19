import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ handle: string }>;
}

export default async function InfoScreen({ params }: Props) {
  const { handle } = await params;
  redirect(`/at/${handle}`);
}
