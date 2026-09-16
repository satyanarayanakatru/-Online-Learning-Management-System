import React from 'react';
import { Star, Clock, UserCheck, Eye, Edit3, Trash2, Tag, Layers } from 'lucide-react';

export default function CourseCard({ course, onViewDetails, onEdit, onDelete }) {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Intermediate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Advanced':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    }
  };

  return (
    <div className="teal-glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xl">
      
      {/* Card Header & Thumbnail */}
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061923] via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#04121b]/90 text-emerald-300 border border-emerald-500/40 shadow-md">
          {course.category}
        </span>

        {/* Rating Badge */}
        <span className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
          <Star className="w-3.5 h-3.5 fill-slate-950" />
          {course.rating}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
            <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              {course.duration}
            </span>
          </div>

          <h3 className="text-base font-black text-white leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-emerald-200/60 font-semibold flex items-center gap-1.5 pt-1">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instructor: <strong className="text-emerald-300">{course.instructor}</strong></span>
          </p>
        </div>

        {/* Price & Actions Row */}
        <div className="pt-3 border-t border-emerald-500/15 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-emerald-200/60 uppercase font-bold tracking-wider block">Price</span>
            <span className="text-xl font-black text-emerald-400">
              ${course.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onViewDetails(course)}
              className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
              title="View Course Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(course)}
              className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              title="Edit Course"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition cursor-pointer"
              title="Delete Course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
