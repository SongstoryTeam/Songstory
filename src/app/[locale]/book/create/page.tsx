import { CreateBookForm } from "./CreateBookForm";

type Props = { params: Promise<{ locale: string }> };

export default async function CreateBookPage({ params }: Props) {
  const { locale } = await params;
  return <CreateBookForm locale={locale} />;
}
