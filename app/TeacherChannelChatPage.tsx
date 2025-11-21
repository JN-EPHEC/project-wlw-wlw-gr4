import { useState } from 'react';
import { ArrowLeft, Send, MoreVertical, Trash2, Pin, Users, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface TeacherChannelChatPageProps {
  channelId?: number;
  clubId?: number;
  onBack?: () => void;
  onNavigate?: (page: string, data?: any) => void;
}

export function TeacherChannelChatPage({ channelId = 1, clubId = 1, onBack, onNavigate }: TeacherChannelChatPageProps) {
  const [message, setMessage] = useState('');

  const channelInfo = {
    id: channelId,
    name: 'général',
    description: 'Discussion générale',
    members: 156,
  };

  const clubInfo = {
    name: 'Club Canin Lyon Sud',
  };

  const permissions = {
    canDeleteMessages: true,
    canPinMessages: true,
    canManageChannel: true,
    canKickMembers: true,
  };

  const messages = [
    {
      id: 1,
      author: 'Marie Dubois',
      role: 'Membre',
      time: '10:30',
      content: 'Bonjour à tous ! Mon chien a vraiment progressé depuis le dernier cours 🐕',
      avatar: 'MD',
    },
    {
      id: 2,
      author: 'Sophie Martin',
      role: 'Éducatrice',
      time: '10:35',
      content: 'C\'est super Marie ! Continue comme ça, la constance est la clé 👍',
      avatar: 'SM',
      isEducator: true,
    },
    {
      id: 3,
      author: 'Thomas Laurent',
      role: 'Membre',
      time: '10:40',
      content: 'Question : est-ce que quelqu\'un a des conseils pour un chien qui tire en laisse ?',
      avatar: 'TL',
    },
    {
      id: 4,
      author: 'Sophie Martin',
      role: 'Éducatrice',
      time: '10:42',
      content: 'Thomas, je te conseille de venir au prochain cours spécialisé "Marche en laisse" jeudi à 15h. On travaillera là-dessus en détail !',
      avatar: 'SM',
      isEducator: true,
    },
    {
      id: 5,
      author: 'Julie Bernard',
      role: 'Membre',
      time: '11:15',
      content: 'Merci pour le cours d\'hier, c\'était génial ! 🎉',
      avatar: 'JB',
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F28B6F] to-[#e67a5f] px-4 pt-12 pb-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-white">#{channelInfo.name}</h2>
            </div>
            <p className="text-white/80 text-sm mt-0.5">
              {clubInfo.name} • {channelInfo.members} membres
            </p>
          </div>
          {permissions.canManageChannel && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate?.('teacher-channel-settings', { channelId, clubId })}>
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres du channel
                </DropdownMenuItem>
                {permissions.canKickMembers && (
                  <DropdownMenuItem onClick={() => onNavigate?.('teacher-channel-members', { channelId, clubId })}>
                    <Users className="h-4 w-4 mr-2" />
                    Gérer les membres
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Channel description */}
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-gray-800">À propos de #{channelInfo.name}</h4>
          </div>
          <p className="text-sm text-gray-600">{channelInfo.description}</p>
        </div>

        {/* Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${
              msg.isEducator 
                ? 'bg-gradient-to-br from-[#41B6A6] to-[#359889]' 
                : 'bg-gradient-to-br from-[#E9B782] to-[#d9a772]'
            }`}>
              {msg.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-gray-800">{msg.author}</h4>
                {msg.isEducator && (
                  <Badge className="bg-[#41B6A6] text-white border-0 text-xs">
                    Éducateur
                  </Badge>
                )}
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-700">{msg.content}</p>
            </div>

            {/* Message actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {permissions.canPinMessages && (
                  <DropdownMenuItem>
                    <Pin className="h-4 w-4 mr-2" />
                    Épingler
                  </DropdownMenuItem>
                )}
                {permissions.canDeleteMessages && (
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <Input
            placeholder={`Message #${channelInfo.name}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-[#F28B6F] hover:bg-[#e67a5f] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
