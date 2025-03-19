import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PageContainer({ children, title, description }: PageContainerProps) {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {(title || description) && (
        <div className="mb-10">
          {title && <h1 className="text-4xl font-bold mb-3">{title}</h1>}
          {description && <p className="text-lg text-muted-foreground">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
