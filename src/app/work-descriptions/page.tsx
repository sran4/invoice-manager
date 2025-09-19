"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkDescription {
  _id: string;
  title: string;
  description: string;
  rate: number;
  createdAt: string;
}

export default function WorkDescriptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workDescriptions, setWorkDescriptions] = useState<WorkDescription[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workDescriptionToDelete, setWorkDescriptionToDelete] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchWorkDescriptions();
  }, [session, status, router]);

  const fetchWorkDescriptions = async () => {
    try {
      const response = await fetch("/api/work-descriptions");
      if (response.ok) {
        const data = await response.json();
        setWorkDescriptions(data.workDescriptions || []);
      }
    } catch (error) {
      console.error("Error fetching work descriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkDescription = (workDescriptionId: string) => {
    setWorkDescriptionToDelete(workDescriptionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!workDescriptionToDelete) return;

    try {
      const response = await fetch(
        `/api/work-descriptions/${workDescriptionToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setWorkDescriptions(
          workDescriptions.filter((w) => w._id !== workDescriptionToDelete)
        );
        toast.success("Work description deleted successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to delete work description");
      }
    } catch (error) {
      console.error("Error deleting work description:", error);
      toast.error("Failed to delete work description");
    } finally {
      setDeleteDialogOpen(false);
      setWorkDescriptionToDelete(null);
    }
  };

  const filteredWorkDescriptions = workDescriptions.filter(
    (workDescription) =>
      workDescription.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workDescription.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredWorkDescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWorkDescriptions = filteredWorkDescriptions.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of work descriptions list
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-800 via-slate-900 to-black p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-800/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 rounded-2xl p-6 border border-white/20 dark:border-slate-700/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Work Descriptions
                </h1>
                <p className="text-slate-200 text-lg">
                  Manage your reusable work descriptions and service rates
                </p>
              </div>
              <Button
                onClick={() => router.push("/work-descriptions/new")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Description
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-3 backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Search className="h-5 w-5 mr-2 text-blue-400" />
                Search Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/20 dark:bg-slate-700/30 border-white/30 dark:border-slate-600/30 text-white placeholder:text-slate-300 focus:ring-blue-400 focus:border-blue-400"
              />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <FileText className="h-5 w-5 mr-2 text-blue-400" />
                Total Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">
                {workDescriptions.length}
              </div>
              <p className="text-sm text-slate-300 overflow-hidden">
                {filteredWorkDescriptions.length} total
              </p>
              <p className="text-xs text-slate-400">
                Page {currentPage} of {totalPages}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Work Descriptions List */}
        {filteredWorkDescriptions.length === 0 ? (
          <Card className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30 shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm
                  ? "No descriptions found"
                  : "No work descriptions yet"}
              </h3>
              <p className="text-slate-300 mb-6 text-center">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Create reusable work descriptions to speed up your invoice creation"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => router.push("/work-descriptions/new")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Description
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentWorkDescriptions.map((workDescription) => (
              <div
                key={workDescription._id}
                className="backdrop-blur-xl bg-white/10 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/30 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer group rounded-lg overflow-hidden h-[300px] w-full relative"
                style={{
                  display: "grid",
                  gridTemplateRows: "80px 1fr 60px",
                  gridTemplateAreas: '"header" "content" "footer"',
                }}
              >
                {/* Header Section - Fixed 80px */}
                <div
                  className="p-3 border-b border-white/10 dark:border-slate-600/20"
                  style={{ gridArea: "header" }}
                >
                  <div className="flex items-start justify-between gap-2 h-full">
                    <div className="flex-1 min-w-0 h-full flex flex-col justify-center">
                      <h3
                        className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "160px",
                          lineHeight: "1.2",
                        }}
                        title={workDescription.title}
                      >
                        {workDescription.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        Added{" "}
                        {new Date(
                          workDescription.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/work-descriptions/${workDescription._id}/edit`
                          )
                        }
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 cursor-pointer p-1 h-6 w-6"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteWorkDescription(workDescription._id)
                        }
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 cursor-pointer p-1 h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content Section - Flexible */}
                <div
                  className="p-3 flex flex-col"
                  style={{ gridArea: "content", overflow: "hidden" }}
                >
                  {/* Description - Strictly contained */}
                  <div className="flex-1 min-h-0 mb-2">
                    <p
                      className="text-sm text-slate-300 leading-relaxed"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.3",
                        maxHeight: "6.5rem", // 5 lines * 1.3 line-height
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                      title={workDescription.description}
                    >
                      {workDescription.description}
                    </p>
                  </div>

                  {/* Rate Section */}
                  {workDescription.rate > 0 && (
                    <div className="flex items-center text-sm font-medium text-green-400 flex-shrink-0">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span className="truncate">
                        ${workDescription.rate.toFixed(2)}/hour
                      </span>
                    </div>
                  )}
                </div>

                {/* Button Section - Fixed 60px */}
                <div className="p-3 pt-0" style={{ gridArea: "footer" }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border-blue-400/30 text-blue-400 hover:text-white hover:border-blue-400 transition-all duration-300 cursor-pointer h-7 text-xs"
                    onClick={() =>
                      router.push(
                        `/invoices/create?workDescription=${workDescription._id}`
                      )
                    }
                  >
                    Use in Invoice
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredWorkDescriptions.length)} of{" "}
              {filteredWorkDescriptions.length} work descriptions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 bg-white/10 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30 text-white hover:bg-white/20 dark:hover:bg-slate-700/30"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                          : "bg-white/10 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30 text-white hover:bg-white/20 dark:hover:bg-slate-700/30"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 bg-white/10 dark:bg-slate-800/20 border-white/20 dark:border-slate-700/30 text-white hover:bg-white/20 dark:hover:bg-slate-700/30"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="backdrop-blur-2xl bg-gradient-to-r from-slate-800/20 via-slate-700/15 to-slate-600/10 border border-white/10 dark:border-slate-700/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Trash2 className="h-5 w-5 mr-2 text-red-400" />
              Delete Work Description
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Are you sure you want to delete this work description? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setWorkDescriptionToDelete(null);
              }}
              className="border-white/20 dark:border-slate-600/20 text-white hover:bg-white/10 hover:text-white hover:border-white/30 hover:shadow-lg transition-all duration-300 cursor-pointer backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
