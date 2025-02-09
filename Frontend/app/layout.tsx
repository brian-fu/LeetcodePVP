// path: app/layout.tsx
export const metadata = {
  title: 'Leetcode PVP',
  description: 'Leetcode but with friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
