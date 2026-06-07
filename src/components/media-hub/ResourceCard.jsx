import { Download, FileText, FileImage, FileArchive } from 'lucide-react';
import { Button } from '@/ui/button';
import { appConfig } from '@/lib/config';

export default function ResourceCard({ resource, onDownload }) {
  const getIcon = (category) => {
    switch(category) {
      case 'Logos and Brand Assets':
      case 'Social Media Graphics':
      case 'Countdown Posters':
      case 'Event Flyers':
        return <FileImage className="w-6 h-6 text-pink-400" />;
      case 'Official Documents':
      case 'Marketing Resources':
        return <FileText className="w-6 h-6 text-blue-400" />;
      default:
        return <FileArchive className="w-6 h-6 text-purple-400" />;
    }
  };

  const handleDownload = async () => {
    await onDownload(resource);
  };

  return (
    <div className="group glass-card rounded-3xl border border-white/[0.05] overflow-hidden flex flex-col hover:border-purple-500/30 transition-colors">
      <div className="aspect-video bg-[#0A0A0F] relative overflow-hidden">
        {resource.thumbnail_url ? (
          <img src={resource.thumbnail_url} alt={resource.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-50 group-hover:scale-110 transition-transform duration-500">
             {getIcon(resource.category)}
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
            {resource.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-black text-white uppercase tracking-wide mb-2 line-clamp-1">{resource.title}</h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">{resource.description || 'No description provided.'}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.05]">
          <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
            {new Date(resource.created_at).toLocaleDateString()}
          </span>
          <Button 
            onClick={handleDownload}
            size="sm"
            className="rounded-xl premium-gradient text-white font-bold h-9 px-4 hover:scale-105 transition-transform"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
