import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Phone, Calendar } from "lucide-react";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6">Applicants Overview</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableCaption className="text-gray-500 mt-4">
              A list of your recent applicants
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Applicant</TableHead>
                <TableHead className="font-semibold">Contact Details</TableHead>
                <TableHead className="font-semibold">Resume</TableHead>
                <TableHead className="font-semibold">Applied Date</TableHead>
                <TableHead className="text-right font-semibold">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants?.applications?.map((item) => (
                <TableRow
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm text-gray-500">
                          {item?.applicant?.fullName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {item?.applicant?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {item?.applicant?.phoneNumber || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item?.applicant?.profile?.resume ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                        asChild
                      >
                        <a
                          href={item?.applicant?.profile?.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="h-4 w-4" />
                          <span>View Resume</span>
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="secondary">Not Available</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(item?.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2">
                        <div className="space-y-1">
                          {shortlistingStatus.map((status, index) => (
                            <Button
                              key={`${status}-${index}`} // Unique key with label and index
                              variant="ghost"
                              className={`w-full justify-start`}
                              onClick={() => statusHandler(status, item?._id)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsTable;
