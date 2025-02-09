// path: app/components/SubmitForm.tsx
"use client";

import { useState, useEffect } from 'react';
import { getGameCodeFromCookie, getUsernameFromCookie } from '../utils/cookies';
import styles from '../styles/submit.module.css';

interface QuestionData {
  title: string;
  description: string;
  examples: {
    input: string;
    output: string;
  }[];
}

interface Question {
  id: number;
  data: QuestionData;
}

const SubmitForm = () => {
  const [code, setCode] = useState('');
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionsResponse = await fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const questionsData = await questionsResponse.json();
        
        if (questionsData.data?.questionids) {
          const questionId = questionsData.data.questionids;
          const questionResponse = await fetch('/api/question', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: questionId }),
          });
          const questionData = await questionResponse.json();
          
          // Get the question data from the specific key
          const questionInfo = questionData.data["question<built-in function id>"];
          
          if (questionInfo) {
            setQuestion({
              id: questionId,
              data: questionInfo
            });
          }
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    const savedGameCode = getGameCodeFromCookie();
    setGameCode(savedGameCode);
    fetchQuestion();
  }, []);

  // Add polling for game status
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ game_code: 'any' }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          // If game is stopped or there's a winner, redirect to home
          if (data.data.game_state === 'STOPPED' || data.data.winner) {
            if (data.data.winner) {
              alert(`Game Over! Winner: ${data.data.winner}`);
            }
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error checking game status:', error);
      }
    }, 1000); // Check every second

    return () => clearInterval(pollInterval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const username = getUsernameFromCookie();
    if (!username) {
      alert('No username found. Please join or host a game first.');
      return;
    }

    if (!gameCode) {
      alert('No game code found. Please join or host a game first.');
      return;
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          game_code: gameCode,
          username: username,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.data?.game_over) {
          // Stop the game when there's a winner
          const stopResponse = await fetch('/api/stop', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
          });

          if (stopResponse.ok) {
            alert(`Game Over! Winner: ${data.data.winner}`);
            window.location.href = '/';
          }
        } else {
          alert('Code submitted successfully!');
        }
      } else {
        alert(data.error || 'Failed to submit code');
      }
    } catch (error) {
      console.error('Error submitting code:', error);
      alert('Failed to submit code');
    }
  };

  const formatExample = (example: { input: string; output: string }) => {
    return `${example.input}\n${example.output}`;
  };

  // Add this new function to handle tab and other key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      
      // Insert 4 spaces for tab
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setCode(newValue);
      
      // Move cursor to after the inserted tab
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      }, 0);
    }

    // Handle enter key to maintain indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const value = e.currentTarget.value;
      
      // Get the current line's indentation
      const currentLine = value.substring(0, start).split('\n').pop() || '';
      const indentation = currentLine.match(/^\s*/)?.[0] || '';
      
      // Insert newline with the same indentation
      const newValue = value.substring(0, start) + '\n' + indentation + value.substring(start);
      setCode(newValue);
      
      // Move cursor to after the inserted newline and indentation
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + indentation.length + 1;
      }, 0);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading question...</div>;
  }

  if (!gameCode) {
    return (
      <div className={styles.container}>
        <p>No active game found. Please join or host a game first.</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className={styles.container}>
        <p>Failed to load question. Please try again.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.questionBox}>
          <div className={styles.questionHeader}>
            <h2>{question?.data?.title}</h2>
          </div>
          <p className={styles.description}>{question?.data?.description}</p>
          <div className={styles.examples}>
            {question?.data?.examples.map((example, index) => (
              <div key={index} className={styles.example}>
                <h4>Example {index + 1}:</h4>
                <pre>{formatExample(example)}</pre>
              </div>
            ))}
          </div>
          <p className={styles.gameCode}>Game Code: {gameCode}</p>
        </div>
        <div className={styles.codeBox}>
          <form onSubmit={handleSubmit} className={styles.submitForm}>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your code here..."
              className={styles.textarea}
              spellCheck={false}
              wrap="off"
            />
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.submitButton}>
                Submit Answer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitForm;