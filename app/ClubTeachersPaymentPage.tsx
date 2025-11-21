import { AlertCircle, ArrowLeft, CheckCircle, CreditCard, Lock, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ClubTeachersPaymentPageProps {
  onBack: () => void;
  onSuccess: () => void;
  teachersCount: number;
  totalPrice: number;
}

export function ClubTeachersPaymentPage({ onBack, onSuccess, teachersCount, totalPrice }: ClubTeachersPaymentPageProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const matches = cleaned.match(/.{1,4}/g);
    return matches ? matches.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiryDate || !cvv || !acceptTerms) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && 
                      cardName.length > 0 && 
                      expiryDate.length === 5 && 
                      cvv.length === 3 &&
                      acceptTerms;

  // Show success screen
  if (paymentSuccess) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h2 className="text-gray-800 mb-2">Paiement réussi !</h2>
            <p className="text-gray-600">
              Votre abonnement pour {teachersCount} professeur{teachersCount > 1 ? 's' : ''} est maintenant actif.
            </p>
          </div>
          <div className="pt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E9B782] mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E9B782] to-[#d9a772] px-4 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <button
          onClick={onBack}
          className="mb-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2">Paiement</h1>
            <p className="text-white/90 text-sm">
              Finalisez votre abonnement
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Order Summary */}
        <Card className="p-4 shadow-sm border-0 bg-gradient-to-br from-[#E9B782]/10 to-white">
          <h3 className="text-gray-800 mb-3">Résumé de la commande</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Forfait professeurs</span>
              <span className="text-gray-800">{teachersCount} professeur{teachersCount > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Facturation</span>
              <span className="text-gray-800">Mensuelle</span>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-800">Total</span>
              <div className="text-right">
                <p className="text-[#E9B782]">{totalPrice}€</p>
                <p className="text-xs text-gray-500">/mois</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Badge */}
        <Alert className="bg-green-50 border-green-200">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-900">
            <strong>Paiement 100% sécurisé</strong> - Vos données bancaires sont cryptées et protégées.
          </AlertDescription>
        </Alert>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-4 shadow-sm border-0">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-[#E9B782]" />
              <h3 className="text-gray-800">Informations de paiement</h3>
            </div>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <Label className="text-gray-700">Numéro de carte</Label>
                <Input
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1.5"
                  maxLength={19}
                />
              </div>

              {/* Card Name */}
              <div>
                <Label className="text-gray-700">Nom sur la carte</Label>
                <Input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="JEAN DUPONT"
                  className="mt-1.5"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-700">Date d'expiration</Label>
                  <Input
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-gray-700">CVV</Label>
                  <Input
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="mt-1.5"
                    type="password"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Terms */}
          <Card className="p-4 shadow-sm border-0 bg-gray-50">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#E9B782] rounded border-gray-300 focus:ring-[#E9B782]"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800 mb-1">
                  J'accepte les conditions générales
                </p>
                <p className="text-xs text-gray-600">
                  En cochant cette case, vous acceptez que Smart Dogs prélève automatiquement {totalPrice}€ chaque mois pour votre abonnement professeurs. Vous pouvez annuler à tout moment depuis votre espace club.
                </p>
              </div>
            </div>
          </Card>

          {/* Info */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <ul className="space-y-1 text-xs">
                <li>• Premier paiement aujourd'hui : {totalPrice}€</li>
                <li>• Renouvellement automatique le {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</li>
                <li>• Vous pouvez annuler à tout moment</li>
                <li>• Aucuns frais de résiliation</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isProcessing}
            className="w-full bg-gradient-to-br from-[#E9B782] to-[#d9a772] hover:from-[#d9a772] hover:to-[#E9B782] shadow-lg h-12"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Payer {totalPrice}€
              </>
            )}
          </Button>

          {/* Security Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Paiement sécurisé SSL 256-bit</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Stripe · Visa · Mastercard · Amex
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
