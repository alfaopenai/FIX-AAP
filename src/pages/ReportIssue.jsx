import React, { useState, useRef } from "react";
import { Issue } from "@/api/entities";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  Wrench,
  DollarSign,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ReportIssue() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
    photos: [],
    location: { address: "" }
  });
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const categories = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "hvac", label: "HVAC" },
    { value: "appliance_repair", label: "Appliance Repair" },
    { value: "carpentry", label: "Carpentry" },
    { value: "painting", label: "Painting" },
    { value: "cleaning", label: "Cleaning" },
    { value: "gardening", label: "Gardening" },
    { value: "other", label: "Other" }
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800" },
    { value: "emergency", label: "Emergency", color: "bg-red-100 text-red-800" }
  ];

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => UploadFile({ file }));
      const uploadResults = await Promise.all(uploadPromises);
      const newPhotoUrls = uploadResults.map(result => result.file_url);
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotoUrls]
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const analyzeIssue = async () => {
    setAnalyzing(true);
    try {
      const prompt = `
        Analyze this home maintenance issue:
        Category: ${formData.category}
        Title: ${formData.title}
        Description: ${formData.description}
        Urgency: ${formData.urgency}
        
        Provide a comprehensive analysis including:
        1. Diagnosis of the problem
        2. Difficulty level (easy/medium/hard/professional_required)
        3. Estimated cost range (min and max)
        4. Step-by-step repair instructions
        5. Tools needed
        6. Materials needed
        7. Safety warnings if applicable
      `;

      const result = await InvokeLLM({
        prompt,
        file_urls: formData.photos,
        response_json_schema: {
          type: "object",
          properties: {
            diagnosis: { type: "string" },
            difficulty_level: { 
              type: "string",
              enum: ["easy", "medium", "hard", "professional_required"]
            },
            estimated_cost: {
              type: "object",
              properties: {
                min: { type: "number" },
                max: { type: "number" }
              }
            },
            instructions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  warning: { type: "string" }
                }
              }
            },
            tools_needed: {
              type: "array",
              items: { type: "string" }
            },
            materials_needed: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAnalysis(result);
      setStep(3);
    } catch (error) {
      console.error("Error analyzing issue:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveIssue = async () => {
    try {
      const issueData = {
        ...formData,
        ai_analysis: analysis,
        status: "analyzed"
      };

      const issue = await Issue.create(issueData);
      navigate(createPageUrl("PostJob") + `?issueId=${issue.id}`);
    } catch (error) {
      console.error("Error saving issue:", error);
    }
  };

  const getDifficultyColor = (level) => {
    const colors = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800", 
      hard: "bg-orange-100 text-orange-800",
      professional_required: "bg-red-100 text-red-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  if (step === 1) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h1>
          <p className="text-gray-600">Tell us about the problem you're experiencing</p>
        </div>

        <Card className="floating-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Title *
              </label>
              <Input
                placeholder="e.g., Leaky kitchen faucet"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl border-gray-200 min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <div className="flex gap-2 flex-wrap">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      formData.urgency === level.value
                        ? level.color
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                placeholder="Enter your address"
                value={formData.location.address}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  location: { ...prev.location, address: e.target.value }
                }))}
                className="rounded-xl border-gray-200"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.category || !formData.description}
                className="btn-primary px-8 py-3 rounded-xl"
              >
                Next: Add Photos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Photos</h1>
          <p className="text-gray-600">Photos help our AI provide better diagnosis</p>
        </div>

        <Card className="floating-card">
          <CardContent className="p-8">
            {/* Upload Zone */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-6 hover:border-gray-300 transition-colors">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Upload Photos of the Issue
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Take clear photos from multiple angles for best results
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    className="btn-primary rounded-xl"
                    disabled={uploading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="rounded-xl"
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            {/* Photo Grid */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-6">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Uploading photos...</span>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="rounded-xl"
              >
                Back
              </Button>
              <Button
                onClick={analyzeIssue}
                disabled={analyzing || formData.photos.length === 0}
                className="btn-primary px-8 py-3 rounded-xl"
              >
                {analyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    Analyze with AI
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 3 && analysis) {
    return (
      <div className="p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Analysis Results</h1>
          <p className="text-gray-600">Here's what our AI found and recommendations</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Analysis Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="floating-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Diagnosis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{analysis.diagnosis}</p>
              </CardContent>
            </Card>

            {/* Instructions */}
            {analysis.instructions && analysis.instructions.length > 0 && (
              <Card className="floating-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-green-600" />
                    Step-by-Step Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.instructions.map((instruction) => (
                    <div key={instruction.step} className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {instruction.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{instruction.title}</h4>
                        <p className="text-gray-600 text-sm">{instruction.description}</p>
                        {instruction.warning && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-yellow-800 text-sm font-medium">{instruction.warning}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="floating-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`${getDifficultyColor(analysis.difficulty_level)} border-0`}>
                    {analysis.difficulty_level.replace('_', ' ')}
                  </Badge>
                </div>

                {analysis.estimated_cost && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        ${analysis.estimated_cost.min} - ${analysis.estimated_cost.max}
                      </div>
                      <div className="text-sm text-gray-500">Estimated cost</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-900">2-4 hours</div>
                    <div className="text-sm text-gray-500">Est. duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tools & Materials */}
            {(analysis.tools_needed?.length > 0 || analysis.materials_needed?.length > 0) && (
              <Card className="floating-card">
                <CardHeader>
                  <CardTitle className="text-lg">What You'll Need</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.tools_needed?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tools:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.tools_needed.map((tool, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.materials_needed?.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Materials:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.materials_needed.map((material, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={saveIssue}
                className="w-full btn-primary rounded-xl py-3"
              >
                Post Job to Marketplace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                onClick={() => navigate(createPageUrl("Dashboard"))}
                variant="outline"
                className="w-full rounded-xl"
              >
                Save for Later
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}