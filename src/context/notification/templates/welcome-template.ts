export const getWelcomeEmailSubject = (): string => {
  return 'Welcome to Follow Habits!';
};

export const getWelcomeEmailHtml = (username: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Follow Habits, ${username}!</h2>
      <p>We are excited to have you on board.</p>
      <p>Start tracking your habits and achieving your goals today.</p>
      <br>
      <p>Best regards,</p>
      <p>The Follow Habits Team</p>
    </div>
  `;
};
