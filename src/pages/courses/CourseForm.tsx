
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCourses } from "@/contexts/lms/CourseContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Plus, Save, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { CourseType } from "@/types";

const CourseForm = () => {
  const { id } = useParams<{ id: string }>();
  const { getCourse, addCourse, updateCourse, loading } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!id;
  const course = isEditing && id ? getCourse(id) : undefined;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "video" as CourseType,
    content: "",
    techStack: [] as string[],
    thumbnail: "",
    duration: 0,
    difficulty: "beginner",
    deadline: undefined as Date | undefined,
    status: "draft"
  });

  const [techInput, setTechInput] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        type: course.type,
        content: course.content,
        techStack: course.techStack || [],
        thumbnail: course.thumbnail || "",
        duration: course.duration || 0,
        difficulty: course.difficulty || "beginner",
        deadline: course.deadline ? new Date(course.deadline) : undefined,
        status: course.status
      });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTech = () => {
    if (techInput && !formData.techStack.includes(techInput)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techInput]
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create or edit courses");
      return;
    }

    if (!formData.title || !formData.description || !formData.content) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && id) {
        await updateCourse(id, formData);
      } else {
        await addCourse(formData);
      }
      navigate("/courses");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if not a teacher
  useEffect(() => {
    if (user && user.role !== "teacher" && user.role !== "admin") {
      navigate("/dashboard");
      toast.error("You don't have permission to create courses");
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Course" : "Create New Course"}
          </h1>
          <Button variant="outline" onClick={() => navigate("/courses")}>
            Cancel
          </Button>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Content Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => handleSelectChange("difficulty", value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content URL *</Label>
                  <Input
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="URL to your course content"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.type === "video" && "Enter the URL to your video content or playlist"}
                    {formData.type === "pdf" && "Enter the URL to your PDF document"}
                    {formData.type === "link" && "Enter the URL to your external resource"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add technology"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddTech}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="px-2 py-1">
                        {tech}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTech(tech)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {formData.techStack.length === 0 && (
                      <p className="text-sm text-muted-foreground">No technologies added</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deadline ? (
                          format(formData.deadline, "PPP")
                        ) : (
                          <span>No deadline</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.deadline}
                        onSelect={(date) =>
                          setFormData(prev => ({ ...prev, deadline: date }))
                        }
                        initialFocus
                      />
                      {formData.deadline && (
                        <div className="p-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              setFormData(prev => ({ ...prev, deadline: undefined }))
                            }
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Remove deadline
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Course Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/courses")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CourseForm;
