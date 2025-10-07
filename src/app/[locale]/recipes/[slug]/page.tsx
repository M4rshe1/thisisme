import Recipe from "@/components/recipe";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ servings?: string }>;
};

export default async function Page(params: PageProps) {
  const { slug } = await params.params;
  const searchParams = await params.searchParams;
  return <Recipe slug={slug} searchParams={searchParams} />;
}
