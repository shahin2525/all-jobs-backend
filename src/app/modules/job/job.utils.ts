export const sanitizeJobContent = (
  description: string,
): { cleaned: string; isCompliant: boolean } => {
  const bannedWords = ['scam', 'adult', 'hack']; // Customize as needed
  const isCompliant = !bannedWords.some((word) =>
    description.toLowerCase().includes(word),
  );
  const cleaned = description.replace(/<script.*?>.*?<\/script>/gi, '');
  return { cleaned, isCompliant };
};
