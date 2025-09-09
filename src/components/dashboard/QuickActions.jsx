import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Search, MessageCircle, Calendar } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Report Issue",
      description: "Take a photo and get instant AI diagnosis",
      icon: Camera,
      color: "from-red-500 to-pink-500",
      link: createPageUrl("ReportIssue")
    },
    {
      title: "Find Professionals",
      description: "Browse verified service providers",
      icon: Search,
      color: "from-blue-500 to-indigo-500",
      link: createPageUrl("FindProfessionals")
    },
    {
      title: "Messages",
      description: "Chat with service providers",
      icon: MessageCircle,
      color: "from-green-500 to-teal-500",
      link: createPageUrl("Messages")
    },
    {
      title: "My Bookings",
      description: "View scheduled appointments",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      link: createPageUrl("Bookings")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Link key={action.title} to={action.link}>
          <Card className="floating-card hover:shadow-lg cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}