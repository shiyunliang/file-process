import { Component, ElementRef } from "@angular/core";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-text-compare',
  standalone: false,
  templateUrl: './text-compare.component.html',
  styleUrl: './text-compare.component.less'
})
export class TextCompareComponent {
  text1: string = '';
  text2: string = '';
  processed1: string = ``;
  processed2: string = ``;
  spaceProcessed1: string = ``;
  spaceProcessed2: string = ``;
  differences: any[] = [];
  
  safeContent1: SafeHtml = '';
  safeContent2: SafeHtml = '';
  safeSpaceContent1: SafeHtml = '';
  safeSpaceContent2: SafeHtml = '';
  
  private sanitizer: DomSanitizer;

  constructor(private elementRef: ElementRef, sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  private sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // 检测空格并标记
  private markSpaces(text: string): string {
    let result = '';
    let spaceCount = 0;
    let i = 0;

    while (i < text.length) {
      if (text[i] === ' ') {
        spaceCount++;
        i++;
        while (i < text.length && text[i] === ' ') {
          spaceCount++;
          i++;
        }
        if (spaceCount > 0) {
          result += `<span class="highlight-space">(${spaceCount}个空格)</span>`;
          spaceCount = 0;
        }
      } else {
        result += text[i];
        i++;
      }
    }

    return result;
  }

  // 检测空格按钮的处理函数
  detectSpaces() {
    if (!this.text1 && !this.text2) return;

    this.spaceProcessed1 = this.markSpaces(this.text1);
    this.spaceProcessed2 = this.markSpaces(this.text2);

    this.safeSpaceContent1 = this.sanitizeHtml(this.spaceProcessed1);
    this.safeSpaceContent2 = this.sanitizeHtml(this.spaceProcessed2);
  }

  compareTexts() {
    this.processed1 = '';
    this.processed2 = '';
    const text1Array = Array.from(this.text1);
    const text2Array = Array.from(this.text2);

    const wrapSpan = (text: string, style: string) => `<span style="${style}">${text}</span>`;
    const styles = {
      delete: 'color: #e74c3c;font-weight: 500;text-decoration: line-through 2px;',
      add: 'color: #2ecc71;font-weight: 500;text-decoration:underline 2px;',
      modify: 'color: #f39c12;font-weight: 500;'
    };

    while (text1Array.length > 0 || text2Array.length > 0) {
      if (text1Array[0] === text2Array[0]) {
        this.processed1 += text1Array.shift() || '';
        this.processed2 += text2Array.shift() || '';
        continue;
      }

      const delIndex = text1Array.indexOf(text2Array[0], 1);
      if (delIndex !== -1) {
        this.processed1 += wrapSpan(text1Array.splice(0, delIndex).join(''), styles.delete) + text1Array.shift();
        this.processed2 += text2Array.shift() || '';
        continue;
      }

      const addIndex = text2Array.indexOf(text1Array[0], 1);
      if (addIndex !== -1) {
        this.processed1 += text1Array.shift() || '';
        this.processed2 += wrapSpan(text2Array.splice(0, addIndex).join(''), styles.add) + text2Array.shift();
        continue;
      }

      const modifyIndex = text1Array.findIndex((_, i) => text2Array.indexOf(text1Array[i], 1) !== -1);
      if (modifyIndex !== -1) {
        this.processed1 += wrapSpan(text1Array.splice(0, modifyIndex).join(''), styles.modify);
        this.processed2 += wrapSpan(text2Array.splice(0, modifyIndex).join(''), styles.modify);
        continue;
      }

      if (text1Array.length > 0) {
        this.processed1 += wrapSpan(text1Array.splice(0).join(''), styles.delete);
      }
      if (text2Array.length > 0) {
        this.processed2 += wrapSpan(text2Array.splice(0).join(''), styles.add);
      }
    }

    this.safeContent1 = this.sanitizeHtml(this.processed1);
    this.safeContent2 = this.sanitizeHtml(this.processed2);
  }

  clearText1() {
    this.text1 = '';
    this.processed1 = '';
    this.spaceProcessed1 = '';
  }

  clearText2() {
    this.text2 = '';
    this.processed2 = '';
    this.spaceProcessed2 = '';
  }

  clearTexts() {
    this.clearText1();
    this.clearText2();
  }
}
