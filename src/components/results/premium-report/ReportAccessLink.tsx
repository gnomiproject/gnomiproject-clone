
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface ReportAccessLinkProps {
  accessLink: string;
}

const ReportAccessLink = ({ accessLink }: ReportAccessLinkProps) => {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessLink);
    toast({
      title: "Copied to clipboard",
      description: "The access link has been copied to your clipboard.",
    });
  };

  return (
    <CardContent>
      <CardTitle>Access Your Report</CardTitle>
      <CardDescription>
        Use the link below to access your full report.
      </CardDescription>
      <div className="mt-4 flex items-center">
        <Input
          type="text"
          value={accessLink}
          readOnly
          className="mr-2"
        />
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Please save this link as it is unique to your request.
      </p>
    </CardContent>
  );
};

export default ReportAccessLink;
