export interface Email {
  to: string[];
  message: {
    subject: string;
    text: string;
    html: string;
  };
}
