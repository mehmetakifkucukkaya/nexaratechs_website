import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Read the Terms of Service for using NexaraTechs website and mobile applications. Understand your rights and responsibilities.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
