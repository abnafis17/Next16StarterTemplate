import React from "react";
import StatusButton from "./StatusButton"; // Update this path as needed

interface ApprovalCardProps {
  status: string;
  department: string;
  approverName: string;
  designation: string;
  approvalDate: string;
}

const bgMap: Record<string, string> = {
  approved: "bg-green-50 border-green-200",
  pending: "bg-orange-50 border-orange-200",
  rejected: "bg-red-50 border-red-200",
  completed: "bg-teal-50 border-teal-200",
  // Add more status styles as needed
};

const VisitApprovalSignature: React.FC<ApprovalCardProps> = ({
  status,
  department,
  approverName,
  designation,
  approvalDate,
}) => {
  const bgClass = bgMap[status.toLowerCase()] || "bg-gray-50 border-gray-200";

  return (
    <div className={`${bgClass} border rounded-lg p-3`}>
      <div className="flex justify-end mb-2">
        <StatusButton status={status} />
      </div>

      <p className="text-[#64748B] font-normal">{department}</p>
      <p className="text-[#020817] font-semibold">{approverName}</p>
      <p className="text-[#64748B] mb-4">{designation}</p>

      <div className="bg-white border rounded-sm border-gray-200 p-4">
        <div className="text-center">
          <p className="text-green-600 font-medium italic">{approverName}</p>
          <p className="text-gray-500 text-sm">{approvalDate}</p>
        </div>
      </div>
    </div>
  );
};

export default VisitApprovalSignature;