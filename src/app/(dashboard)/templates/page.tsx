"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileStack, ArrowRight, Filter } from "lucide-react";
import { SEED_TEMPLATES } from "@/lib/templates/seedTemplates";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TemplatesCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    SEED_TEMPLATES.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return SEED_TEMPLATES.filter((tmpl) => {
      const matchesCategory =
        selectedCategory === "All" || tmpl.category === selectedCategory;
      const matchesSearch =
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <FileStack className="w-7 h-7 text-sky-400" />
          <span>Pre-Legal Document Templates</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Browse our structured pre-legal template library. Select any template to configure and generate.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0f1624] border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates by title, keyword, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[#0a0d14] border border-slate-700/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-[#0f1624] border border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-400">No templates match your search filters.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tmpl) => (
            <Card
              key={tmpl.slug}
              hoverEffect
              className="flex flex-col justify-between space-y-6 bg-[#0f1624] border-slate-800/90"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">{tmpl.category}</Badge>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {tmpl.fields_schema.length} fields
                  </span>
                </div>
                <CardTitle className="text-base text-slate-100">{tmpl.name}</CardTitle>
                <CardDescription className="line-clamp-3 leading-relaxed">
                  {tmpl.description}
                </CardDescription>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">PDF + DOCX</span>
                <Link href={`/templates/${tmpl.slug}`}>
                  <Button size="sm" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                    Draft Document
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
