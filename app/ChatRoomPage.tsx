import { ArrowLeft, MoreVertical, Paperclip, Send, Smile, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface ChatRoomPageProps {
  clubId: number;
  channelId: string;
  channelName: string;
  onBack: () => void;
}

export function ChatRoomPage({ channelId, channelName, onBack }: ChatRoomPageProps) {
  const [newMessage, setNewMessage] = useState('');
  const isAnnouncementChannel = channelId === 'announcements';

  // Mock messages data - different based on channel type
  const announcementMessages = [
    {
      id: 1,
      user: 'Sophie Martin',
      userRole: 'Éducatrice',
      avatar: 'SM',
      message: 'Nouvelle session de groupe ce samedi ! 🎉\n\nNous organisons une session spéciale pour tous les niveaux. Inscriptions ouvertes jusqu\'à vendredi soir.\n\nHoraire : 14h-16h\nTarif : 25€',
      time: 'Il y a 2h',
      isEducator: true,
      reactions: { '❤️': 12, '👍': 8, '🐕': 15 },
    },
    {
      id: 2,
      user: 'Lucas Dubois',
      userRole: 'Éducateur',
      avatar: 'LD',
      message: 'Rappel important : Le club sera fermé lundi prochain pour maintenance.\n\nMerci de votre compréhension ! 🔧',
      time: 'Hier',
      isEducator: true,
      reactions: { '👍': 23 },
    },
    {
      id: 3,
      user: 'Emma Bernard',
      userRole: 'Éducatrice',
      avatar: 'EB',
      message: 'Excellentes nouvelles ! 🏆\n\nNos élèves ont brillé au concours régional ce week-end. Félicitations à tous !',
      time: 'Il y a 3 jours',
      isEducator: true,
      reactions: { '🎉': 34, '❤️': 28, '👏': 19 },
    },
  ];

  const regularMessages = [
    {
      id: 1,
      user: 'Sophie Martin',
      userRole: 'Éducatrice',
      avatar: 'SM',
      message: 'Bonjour à tous ! Rappel important pour la séance de demain 🐕',
      time: '10:30',
      isEducator: true,
    },
    {
      id: 2,
      user: 'Marc Dubois',
      avatar: 'MD',
      message: 'Merci Sophie ! À quelle heure exactement ?',
      time: '10:32',
      isEducator: false,
    },
    {
      id: 3,
      user: 'Sophie Martin',
      userRole: 'Éducatrice',
      avatar: 'SM',
      message: 'À 14h comme d\'habitude. N\'oubliez pas d\'apporter des friandises pour récompenser vos chiens ! 🦴',
      time: '10:35',
      isEducator: true,
    },
    {
      id: 4,
      user: 'Julie Laurent',
      avatar: 'JL',
      message: 'Super ! Mon chien adore ces séances 😊',
      time: '10:40',
      isEducator: false,
    },
    {
      id: 5,
      user: 'Thomas Bernard',
      avatar: 'TB',
      message: 'Question : est-ce qu\'on peut amener un deuxième chien ?',
      time: '11:15',
      isEducator: false,
    },
    {
      id: 6,
      user: 'Sophie Martin',
      userRole: 'Éducatrice',
      avatar: 'SM',
      message: 'Oui Thomas, pas de problème ! Préviens-moi juste avant pour que je puisse adapter les exercices.',
      time: '11:18',
      isEducator: true,
    },
    {
      id: 7,
      user: 'Emma Petit',
      avatar: 'EP',
      message: 'Quelqu\'un sait si le parking est disponible ?',
      time: '12:20',
      isEducator: false,
    },
    {
      id: 8,
      user: 'Marc Dubois',
      avatar: 'MD',
      message: 'Oui Emma, il y a toujours de la place le samedi après-midi 👍',
      time: '12:25',
      isEducator: false,
    },
  ];

  const messages = isAnnouncementChannel ? announcementMessages : regularMessages;

  const handleReaction = (messageId: number, emoji: string) => {
    // In real app, would send reaction to backend
    console.log('Adding reaction:', emoji, 'to message:', messageId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In real app, would send message to backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className={`px-4 pt-12 pb-4 shadow-md ${
        isAnnouncementChannel 
          ? 'bg-gradient-to-br from-[#F28B6F] to-[#E67A5F]' 
          : 'bg-gradient-to-br from-[#41B6A6] to-[#359889]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="text-white truncate">{channelName}</h2>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <Users className="h-3.5 w-3.5" />
                <span>234 membres</span>
              </div>
              {isAnnouncementChannel && (
                <p className="text-white/90 text-xs mt-1">Seuls les éducateurs peuvent publier</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full flex-shrink-0"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {/* Date Separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-200 rounded-full px-4 py-1">
              <span className="text-xs text-gray-600">Aujourd'hui</span>
            </div>
          </div>

          {messages.map((msg: any) => (
            <div key={msg.id} className="flex gap-3">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                isAnnouncementChannel && msg.isEducator
                  ? 'bg-gradient-to-br from-[#F28B6F] to-[#E67A5F]'
                  : 'bg-gradient-to-br from-[#41B6A6] to-[#359889]'
              }`}>
                {msg.avatar}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-gray-800">{msg.user}</span>
                  {msg.isEducator && (
                    <span className={`text-xs text-white px-2 py-0.5 rounded-full ${
                      isAnnouncementChannel ? 'bg-[#F28B6F]' : 'bg-[#41B6A6]'
                    }`}>
                      {msg.userRole}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <div className={`rounded-2xl rounded-tl-none px-4 py-3 ${
                  isAnnouncementChannel && msg.isEducator
                    ? 'bg-gradient-to-br from-[#F28B6F]/10 to-[#F28B6F]/5 border border-[#F28B6F]/20'
                    : 'bg-gray-100'
                }`}>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-line">{msg.message}</p>
                </div>

                {/* Reactions for announcement channel */}
                {isAnnouncementChannel && msg.reactions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(msg.reactions).map(([emoji, count]: [string, any]) => (
                      <Button
                        key={emoji}
                        variant="outline"
                        size="sm"
                        onClick={() => handleReaction(msg.id, emoji)}
                        className="h-7 px-2 rounded-full border-gray-300 hover:border-[#F28B6F] hover:bg-[#F28B6F]/10"
                      >
                        <span className="text-sm">{emoji}</span>
                        <span className="text-xs text-gray-600 ml-1">{count}</span>
                      </Button>
                    ))}
                    {/* Add reaction button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 rounded-full border-gray-300 hover:border-[#F28B6F] hover:bg-[#F28B6F]/10"
                    >
                      <Smile className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input - Different for announcement channel */}
      {isAnnouncementChannel ? (
        <div className="border-t-2 border-[#F28B6F]/20 p-4 bg-gradient-to-br from-[#F28B6F]/5 to-transparent">
          <Card className="p-4 border-[#F28B6F]/30 bg-white">
            <div className="flex items-center gap-3 text-center">
              <Smile className="h-5 w-5 text-[#F28B6F]" />
              <p className="text-sm text-gray-600 flex-1">
                Réagissez aux annonces avec les emojis pour montrer votre intérêt !
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-gray-500 hover:text-[#41B6A6]"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Envoyer un message..."
                className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 text-gray-500 hover:text-[#41B6A6] h-8 w-8"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="flex-shrink-0 bg-[#41B6A6] hover:bg-[#359889] rounded-full h-12 w-12 p-0 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
