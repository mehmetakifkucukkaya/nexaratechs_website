import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Apps",
    description: "Discover our premium mobile applications. Beautifully crafted apps designed to enhance your daily life with innovative features and stunning design.",
    openGraph: {
        title: "Our Apps | NexaraTechs",
        description: "Discover our premium mobile applications. Beautifully crafted apps designed to enhance your daily life.",
        type: "website",
    },
};

export default function AppsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
