import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArtCollectionsCollection from "@/collections/ArtCollectionsCollection";
import UtilityLibrary from "@/libraries/UtilityLibrary";
import ClientCollection from "./ClientCollection";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const currentCollectionPath = resolvedParams.id;
  const currentCollection = ArtCollectionsCollection.find(
    (collection) => collection.path === currentCollectionPath,
  );

  if (!currentCollection) {
    return {};
  }

  let image: string | undefined = undefined;
  if (currentCollection.thumbnail) {
    image = UtilityLibrary.renderAssetPath(
      currentCollection.thumbnail,
      currentCollection.path,
    );
  } else if (currentCollection.works[0]?.imagePath) {
    image = UtilityLibrary.renderAssetPath(
      currentCollection.works[0].imagePath,
      currentCollection.path,
    );
  } else if (currentCollection.poster) {
    image = UtilityLibrary.renderAssetPath(
      currentCollection.poster,
      currentCollection.path,
    );
  }

  return {
    title: currentCollection.documentTitle,
    description: currentCollection.documentDescription,
    keywords: currentCollection.documentKeywords,
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const currentCollectionPath = resolvedParams.id;
  const currentCollection = ArtCollectionsCollection.find(
    (collection) => collection.path === currentCollectionPath,
  );

  if (!currentCollection) {
    notFound();
  }

  return (
    <ClientCollection
      currentCollectionWorks={currentCollection.works}
      currentCollection={currentCollection}
    />
  );
}
