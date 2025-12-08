import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { UploadableFile } from '@/types/uploads';
export type { UploadableFile } from '@/types/uploads';

export const palette = {
  primary: '#41B6A6',
  primaryDark: '#2fa291',
  teacher: '#F28B6F',
  teacherDark: '#e2795e',
  club: '#E9B782',
  clubDark: '#d9a36a',
  text: '#1F2937',
  gray: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
};

export const cardStyle: ViewStyle = {
  backgroundColor: palette.surface,
  borderRadius: 18,
  padding: 18,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 3,
};

export const authStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20, gap: 16, paddingBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: palette.text, marginBottom: 12 },
  label: { fontSize: 14, color: palette.text, fontWeight: '700', marginBottom: 6 },
  input: {
    flex: 1,
    color: palette.text,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    gap: 10,
  },
  helperText: { color: palette.gray, fontSize: 12, marginTop: 6 },
  link: { color: palette.primary, fontWeight: '700' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: palette.text },
  infoDescription: { fontSize: 12.5, color: palette.gray, marginTop: 4, lineHeight: 18 },
});

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  outline?: boolean;
};

export function PrimaryButton({
  title,
  onPress,
  color = palette.primary,
  disabled,
  loading,
  outline,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      disabled={disabled || loading}
      style={[
        styles.button,
        outline
          ? { borderColor: color, borderWidth: 1, backgroundColor: 'transparent' }
          : { backgroundColor: color },
        (disabled || loading) && { opacity: 0.6 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? color : '#fff'} />
      ) : (
        <Text style={[styles.buttonText, outline && { color }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  icon?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  rightSlot?: React.ReactNode;
};

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  icon,
  autoCapitalize = 'none',
  multiline,
  rightSlot,
}: LabeledInputProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={authStyles.label}>{label}</Text>
      <View style={authStyles.inputRow}>
        {icon ? <View style={{ marginLeft: 2 }}>{icon}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          style={[
            authStyles.input,
            multiline && { height: 96, textAlignVertical: 'top', paddingTop: 12, paddingBottom: 12 },
          ]}
        />
        {rightSlot}
      </View>
    </View>
  );
}

type CheckboxRowProps = { checked: boolean; onToggle: () => void; label: string; description?: string; accent?: string };

export function CheckboxRow({ checked, onToggle, label, description, accent = palette.primary }: CheckboxRowProps) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85} style={styles.checkboxRow}>
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? accent : palette.border,
            backgroundColor: checked ? accent : 'transparent',
          },
        ]}
      >
        {checked ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.checkboxLabel}>{label}</Text>
        {description ? <Text style={styles.checkboxDescription}>{description}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

type InfoCardProps = {
  title: string;
  description: string;
  color?: string;
  icon?: React.ReactNode;
};

export function InfoCard({ title, description, color = palette.primary, icon }: InfoCardProps) {
  return (
    <View style={[cardStyle, styles.infoCard, { borderLeftColor: color }]}>
      {icon ?? <MaterialCommunityIcons name="information-outline" size={22} color={color} />}
      <View style={{ flex: 1 }}>
        <Text style={authStyles.infoTitle}>{title}</Text>
        <Text style={authStyles.infoDescription}>{description}</Text>
      </View>
    </View>
  );
}

type SelectChipProps = { label: string; selected: boolean; onPress: () => void; color?: string };

export function SelectChip({ label, selected, onPress, color = palette.primary }: SelectChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: color, borderColor: color },
      ]}
      activeOpacity={0.85}
    >
      <Text style={[styles.chipText, selected && { color: '#fff', fontWeight: '700' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

type UploadFieldProps = {
  title: string;
  files: UploadableFile[];
  onPick: () => void;
  color?: string;
  description?: string;
  single?: boolean;
};

export function UploadField({ title, files, onPick, color = palette.primary, description, single }: UploadFieldProps) {
  return (
    <View style={[cardStyle, { gap: 10 }]}>
      <Text style={authStyles.sectionTitle}>{title}</Text>
      {description ? <Text style={authStyles.infoDescription}>{description}</Text> : null}
      <TouchableOpacity
        onPress={onPick}
        activeOpacity={0.85}
        style={[styles.uploadZone, { borderColor: color }]}
      >
        <Ionicons name="cloud-upload-outline" size={22} color={color} />
        <Text style={[styles.uploadText, { color }]}>{single ? 'Ajouter un fichier' : 'Cliquer pour ajouter des fichiers'}</Text>
      </TouchableOpacity>
      {files.length ? (
        <View style={{ gap: 6 }}>
          {files.map((file) => (
            <View key={file.uri} style={styles.fileRow}>
              <Ionicons name="document-text-outline" size={16} color={color} />
              <Text style={styles.fileName} numberOfLines={1}>
                {file.name ?? file.uri.split('/').pop()}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  color?: string;
};

export function AuthHeader({ title, subtitle, onBack, color = palette.primary }: AuthHeaderProps) {
  return (
    <LinearGradient colors={[color, color, '#ffffff']} style={styles.header}>
      <View style={{ width: '100%', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.85}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  checkboxRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  checkbox: {
    height: 22,
    width: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxLabel: { color: palette.text, fontSize: 14, fontWeight: '700' },
  checkboxDescription: { color: palette.gray, fontSize: 12, marginTop: 4, lineHeight: 18 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderLeftWidth: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#F9FAFB',
  },
  chipText: { fontSize: 13, color: palette.text },
  uploadZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    gap: 10,
  },
  uploadText: { fontWeight: '700' },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8FAFC', padding: 10, borderRadius: 10 },
  fileName: { color: palette.text, fontSize: 13, flex: 1 },
  header: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: 'rgba(255,255,255,0.92)', fontSize: 14 },
});
