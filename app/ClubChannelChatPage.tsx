import { ArrowLeft, Bell, Hash, Paperclip, Send, Smile } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ClubChannelChatPageProps {
  channelId: string;
  channelName: string;
  onBack: () => void;
}

export function ClubChannelChatPage({ channelId, channelName, onBack }: ClubChannelChatPageProps) {
  const [message, setMessage] = useState('');

  // Mock messages
  const messages = [
    {
      id: 1,
      user: 'Éducateur',
      userRole: 'Éducateur',
      message: 'Bonjour à tous ! N\'oubliez pas la session de groupe ce samedi à 14h 🐕',
      time: '10:30',
      isClubStaff: true,
    },
    {
      id: 2,
      user: 'Membre',
      userRole: 'Membre',
      message: 'Bonjour ! Est-ce qu\'il faut apporter quelque chose de spécial ?',
      time: '10:32',
      isClubStaff: false,
    },
    {
      id: 3,
      user: 'Éducateur',
      userRole: 'Éducateur',
      message: 'Apportez des friandises et de l\'eau pour votre chien. On fournit le matériel !',
      time: '10:35',
      isClubStaff: true,
    },
    {
      id: 4,
      user: 'Membre',
      userRole: 'Membre',
      message: 'Super ! Nous serons là 🎉',
      time: '10:40',
      isClubStaff: false,
    },
    {
      id: 5,
      user: 'Membre',
      userRole: 'Membre',
      message: 'Question : c\'est adapté pour un chien réactif ? Mon chien a encore du mal avec les autres chiens...',
      time: '11:15',
      isClubStaff: false,
    },
    {
      id: 6,
      user: 'Éducateur',
      userRole: 'Éducateur',
      message: 'Oui ! On travaillera justement sur la socialisation. Je serai là pour vous accompagner 👍',
      time: '11:20',
      isClubStaff: true,
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const isAnnouncementChannel = channelId === 'announcements';

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className={`${
        isAnnouncementChannel 
          ? 'bg-gradient-to-br from-[#F28B6F] to-[#E67A5F]' 
          : 'bg-gradient-to-br from-gray-700 to-gray-600'
      } px-4 pt-12 pb-4 shadow-lg`}>
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isAnnouncementChannel ? (
                <Bell className="h-5 w-5 text-white" />
              ) : (
                <Hash className="h-5 w-5 text-white" />
              )}
              <h1 className="text-white">{channelName}</h1>
            </div>
            <p className="text-sm text-white/80">127 membres</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-3">
            <Avatar className="w-10 h-10 bg-[#E9B782]/20 text-[#E9B782] flex items-center justify-center flex-shrink-0">
              {msg.user.charAt(0)}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-800">{msg.user}</span>
                {msg.isClubStaff && (
                  <span className="text-xs bg-[#E9B782] text-white px-2 py-0.5 rounded">
                    {msg.userRole}
                  </span>
                )}
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {isAnnouncementChannel && (
          <div className="mb-3 p-2 bg-[#F28B6F]/10 border-l-4 border-[#F28B6F] rounded text-sm text-gray-700">
            <Bell className="h-4 w-4 inline mr-2 text-[#F28B6F]" />
            Vous publiez une annonce officielle - Tous les membres seront notifiés
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isAnnouncementChannel ? "Écrivez une annonce..." : "Écrivez un message..."}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            onClick={handleSend}
            className={`flex-shrink-0 ${
              isAnnouncementChannel 
                ? 'bg-[#F28B6F] hover:bg-[#E67A5F]' 
                : 'bg-[#41B6A6] hover:bg-[#359889]'
            }`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
