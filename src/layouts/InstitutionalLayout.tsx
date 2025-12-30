import { ReactNode } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Breadcrumb } from '@/components/seo/Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface InstitutionalLayoutProps {
  children: ReactNode;
  breadcrumbs: BreadcrumbItem[];
}

export const InstitutionalLayout = ({ children, breadcrumbs }: InstitutionalLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumb items={breadcrumbs} />
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
