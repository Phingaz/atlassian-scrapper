import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const SectionWrapper = ({
  header,
  children,
}: {
  header: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-[500] text-xl">{header}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default SectionWrapper;
