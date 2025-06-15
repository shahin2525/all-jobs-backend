"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeJobContent = void 0;
const sanitizeJobContent = (description) => {
    const bannedWords = ['scam', 'adult', 'hack']; // Customize as needed
    const isCompliant = !bannedWords.some((word) => description.toLowerCase().includes(word));
    const cleaned = description.replace(/<script.*?>.*?<\/script>/gi, '');
    return { cleaned, isCompliant };
};
exports.sanitizeJobContent = sanitizeJobContent;
