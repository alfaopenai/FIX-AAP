import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';

export default function ProfessionalCard({ professional }) {
    const categoryNames = {
        plumbing: "אינסטלטור",
        electrical: "חשמלאי",
        moving_and_deliveries: "הובלות ומשלוחים",
        carpentry: "נגר",
        painting: "צבעי",
        other: "שונות"
    };

    return (
        <Link to={createPageUrl('ProfessionalProfile') + `?id=${professional.id}`} className="block h-full group">
            <Card className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 group-hover:border-cyan-500/50">
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                
                <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                    {/* Header with avatar and name */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300 mb-2">
                                {professional.business_name}
                            </h3>
                            {professional.rating && (
                                <div className="flex items-center gap-1.5 text-sm text-gray-400 transition-all duration-300 group-hover:text-gray-300">
                                    <span className="font-semibold text-white transition-colors duration-300 group-hover:text-yellow-300">
                                        {professional.rating.toFixed(1)}
                                    </span>
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="mr-1">({professional.review_count} ביקורות)</span>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Avatar className="w-16 h-16 border-2 border-cyan-500/30 transition-all duration-300 group-hover:border-cyan-400/70 group-hover:scale-110">
                                <AvatarImage src={professional.profile_photo} />
                                <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold">
                                    {professional.business_name?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            {/* Gold achievement badge */}
                            {professional.rating && professional.rating > 4.5 && (
                                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 border-2 border-gray-900">
                                    <Award className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1 transition-colors duration-300 group-hover:text-gray-200 leading-relaxed">
                        {professional.bio}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {professional.specialties?.slice(0, 1).map((spec, index) => (
                            <Badge 
                                key={spec} 
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 px-3 py-1 rounded-full transition-all duration-300 group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:scale-105"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {categoryNames[spec] || spec}
                            </Badge>
                        ))}
                    </div>
                </CardContent>

                {/* Bottom glow line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
        </Link>
    );
}