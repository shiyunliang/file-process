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

    for (let i = 0; i < Math.min(text1Array.length, text2Array.length); i++) {
        //value is equal 当字符相同时
        if (text1Array[0] === text2Array[0]) {
            this.processed1 += text1Array[0];
            this.processed2 += text2Array[0];
            text1Array.splice(0, 1);
            text2Array.splice(0, 1);
            i = -1;
            continue;
        }
        //delIndex 当字符为删除字符时
        const delIndex = text1Array.indexOf(text2Array[0], 1)
        if (delIndex != -1) {
            this.processed1 += `<span style='color: #e74c3c;font-weight: 500;text-decoration: line-through 2px;'>` + text1Array.slice(0, delIndex).join('') + '</span>' + text1Array[delIndex];
            this.processed2 += text2Array[0];
            text1Array.splice(0, delIndex + 1);
            text2Array.splice(0, 1);
            i = -1;
            continue;
        }
        //increase word 当字符为新增字符时
        const increIndex = text2Array.indexOf(text1Array[0], 1)
        if (increIndex != -1) {
            this.processed1 += text1Array[0];
            this.processed2 += `<span style='color: #2ecc71;font-weight: 500;text-decoration:underline 2px;'>` + text2Array.slice(0, increIndex).join('') + '</span>' + text2Array[increIndex];
            text1Array.splice(0, 1);
            text2Array.splice(0, increIndex + 1);
            i = -1;
            continue;
        }
        //multi match 当字符为修改字符时
        let equalIndex = -1;
        for (let j = 1; j < text1Array.length; j++) {
            const matchIndex = text2Array.indexOf(text1Array[j], 1);
            if (matchIndex !== -1) {
                equalIndex = matchIndex;
                break;
            }
        }
        if (equalIndex != -1) {
            this.processed1 += `<span style='color: #f39c12;font-weight: 500;'>` + text1Array.slice(0, equalIndex).join('') + '</span>';
            this.processed2 += `<span style='color: #f39c12;font-weight: 500;'>` + text2Array.slice(0, equalIndex).join('') + '</span>';
            text1Array.splice(0, 1);
            text2Array.splice(0, 1);
            i = -1;
        }
    }
    if(text1Array.length > 0) {
        this.processed1 += `<span style='color: #e74c3c;font-weight: 500;text-decoration: line-through;'>` + text1Array.join('') + '</span>';
    }
    if(text2Array.length > 0) {
        this.processed2 += `<span style='color: #2ecc71;font-weight: 500;'>` + text2Array.join('') + '</span>';
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
