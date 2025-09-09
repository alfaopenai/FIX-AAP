import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';

export default function ProfessionalCard({ professional }) {
    const responseTimeMap = {
        immediate: "מיידי",
        within_hour: "עד שעה",
        within_day: "עד 24 שעות",
        flexible: "גמיש"
    };

    return (
        <Link to={createPageUrl("FindProfessionals")} className="block group">
            <Card className="bg-gray-900 border-0 rounded-2xl overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
                <img 
                    src={professional.profile_photo || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'} 
                    alt={professional.business_name}
                    className="w-full h-40 object-cover"
                />
                <div className="p-4 text-right">
                    <h3 className="font-bold text-lg text-white">{professional.business_name}</h3>
                    <p className="text-sm text-gray-400 mb-2 capitalize">{professional.specialties.join(', ')}</p>
                    <div className="flex justify-end items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                            <span>{professional.rating?.toFixed(1) || 'חדש'}</span>
                            <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span>{responseTimeMap[professional.response_time] || "גמיש"}</span>
                            <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}