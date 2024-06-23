import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {
  main!: HTMLElement;
  textContainer!: HTMLElement;
  resultsContainer!: HTMLElement;
  wpmText!: HTMLElement;
  accuracyText!: HTMLElement;
  timeText!: HTMLElement;

  invalidKeys: string[] = 'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 Escape Tab CapsLock Shift Control Alt Meta ArrowLeft ArrowRight ArrowDown ArrowUp Enter'.split(' ');

  errors: string[] = [];
  firstTime = true;
  currentPos = 0;
  backspaceNeeded = false;
  currentTime = 0;
  repeat!: number;

  ngOnInit(): void {
    this.main = document.getElementById('main') as HTMLElement;
    this.textContainer = document.getElementById('text-container') as HTMLElement;
    this.resultsContainer = document.getElementById('results') as HTMLElement;
    this.wpmText = document.getElementById('wpm') as HTMLElement;
    this.accuracyText = document.getElementById('accuracy') as HTMLElement;
    this.timeText = document.getElementById('time') as HTMLElement;

    this.initializeTypingTest();
  }

  async fetchQuote(): Promise<string> {
    try {
      const response = await fetch('https://api.everrest.educata.dev/quote?page_size=50');
      const data = await response.json();
      const quotes = data.quotes;
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex].quote;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return 'Error fetching quote. Please try again.';
    }
  }

  async initializeTypingTest(): Promise<void> {
    const text = await this.fetchQuote();
    const textArr = text.split('');
    const htmlArr = textArr.map((item, index) => {
      if (item === ' ') {
        return `<span class="space" id="span${index}">${item}</span>`;
      }
      return `<span class="char" id="span${index}">${item}</span>`;
    });
    this.textContainer.innerHTML = htmlArr.join('');

    document.addEventListener('keydown', event => {
      if (event.key === ' ') {
        event.preventDefault();
      }
      if (this.firstTime) {
        this.firstTime = false;
        this.repeat = window.setInterval(() => this.currentTime++, 1000);
      }
      if (event.location === 0 && !this.invalidKeys.includes(event.key)) {
        this.handleKey(event.key, textArr);
      }
    });
  }

  handleKey(key: string, textArr: string[]): void {
    const span = document.getElementById(`span${this.currentPos}`)!.style;
    if (!this.backspaceNeeded) {
      if (key === textArr[this.currentPos]) {
        span.color = 'green';
        this.currentPos++;
      } else {
        if (textArr[this.currentPos] === ' ') {
          span.backgroundColor = 'red';
        } else {
          span.color = 'red';
        }
        this.backspaceNeeded = true;
        this.errors.push(textArr[this.currentPos]);
      }
    } else {
      if (key === 'Backspace') {
        if (textArr[this.currentPos] === ' ') {
          span.backgroundColor = 'transparent';
        } else {
          span.color = 'white'; 
        }
        this.backspaceNeeded = false;
      }
    }
    if (this.currentPos === textArr.length) {
      clearInterval(this.repeat);
      this.handleEnd(textArr);
    }
  }

  handleEnd(textArr: string[]): void {
    const wpm = Math.floor(textArr.length / 5 / (this.currentTime / 60));
    const accuracy = Math.floor(((textArr.length - this.errors.length) / textArr.length) * 100);
    const multiples = Math.floor(this.currentTime / 60);
    const seconds = this.currentTime - multiples * 60;
    this.wpmText.innerHTML = `${wpm} wpm`;
    this.accuracyText.innerHTML = `${accuracy}%`;
    this.timeText.innerHTML = `${multiples} m ${seconds} s`;
    this.main.style.display = 'none';
    this.resultsContainer.style.display = 'block';
  }



  }
