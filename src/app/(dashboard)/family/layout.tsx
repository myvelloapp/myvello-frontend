import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Household Workspace | Myvello",
  description:
    "You have been invited to collaborate in a household workspace on Myvello. Track shared loans, pool EMI schedules, and coordinate family finances in complete privacy.",
  openGraph: {
    title: "Join Household Workspace | Myvello",
    description:
      "Collaborate on shared household loans and pool EMI schedules in complete privacy. Your personal vault remains 100% confidential.",
    url: "/family",
    siteName: "Myvello",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Myvello Household Workspace Invitation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Household Workspace | Myvello",
    description:
      "Collaborate on shared household loans and pool EMI schedules in complete privacy.",
    images: ["/og.png"],
  },
};

export default function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
