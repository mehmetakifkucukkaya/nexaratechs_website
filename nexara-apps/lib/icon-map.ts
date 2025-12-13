import { Zap, Stars, Shield, Smartphone, Globe, BarChart3, Lock, MessageSquare, Sparkles, Moon, Download, Share2, Rocket } from "lucide-react";

export const iconMap: Record<string, any> = {
    "Zap": Zap,
    "Stars": Stars,
    "Shield": Shield,
    "Smartphone": Smartphone,
    "Globe": Globe,
    "BarChart3": BarChart3,
    "Lock": Lock,
    "MessageSquare": MessageSquare,
    "Sparkles": Sparkles,
    "Moon": Moon,
    "Download": Download,
    "Share2": Share2,
    "Rocket": Rocket,
    "FastIcon": Zap // Alias used in data.ts
};

export const getIcon = (name: string) => {
    return iconMap[name] || Sparkles; // Default to Sparkles if not found
};
