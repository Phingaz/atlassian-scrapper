import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import React from "react";

const SectionWrapper = ({
  header,
  children,
  className,
}: {
  header: string;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <ScrollArea className="h-full">
        <CardHeader>
          <CardTitle className="font-[500] text-xl">{header}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </ScrollArea>
    </Card>
  );
};

export default SectionWrapper;
