import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-excel-split',
  standalone: true,
  imports: [NzButtonModule, NzIconModule, NzUploadModule, NzInputNumberModule, FormsModule],
  templateUrl: './excel-split.component.html',
  styleUrl: './excel-split.component.less'
})
export class ExcelSplitComponent {
  rowsPerFile: number = 1000; // 默认每个文件1000行

  constructor(private messageService: NzMessageService) {}

  // 将数据分成多个数组
  private splitData(data: any[]): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < data.length; i += this.rowsPerFile) {
      result.push(data.slice(i, i + this.rowsPerFile));
    }
    return result;
  }

  // 导出Excel文件
  private exportToExcel(data: any[], fileName: string) {
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data);
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // 导出文件
    XLSX.writeFile(wb, fileName);
  }

  customRequest = (item: NzUploadXHRArgs): Subscription => {
    const file = item.file;
    const reader = new FileReader();
    
    return new Observable(subscriber => {
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 将工作表转换为JSON数组
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 将数据分成多个数组
        const splitArrays = this.splitData(jsonData);
        
        // 导出为多个Excel文件
        const originalFileName = file.name.replace('.xlsx', '').replace('.xls', '');
        splitArrays.forEach((part, index) => {
          this.exportToExcel(part, `${originalFileName}_part${index + 1}.xlsx`);
        });
        
        this.messageService.success(`文件已拆分为 ${splitArrays.length} 个部分！`);
        
        // 调用成功回调
        if (item.onSuccess) {
          item.onSuccess({}, file, new Event('success'));
        }
        subscriber.complete();
      };
      
      reader.onerror = (error) => {
        console.error('读取文件失败：', error);
        this.messageService.error('文件读取失败！');
        if (item.onError) {
          item.onError(error, file);
        }
        subscriber.error(error);
      };
      
      // 开始读取文件
      reader.readAsArrayBuffer(file as unknown as Blob);
    }).subscribe();
  };

  handleChange(info: { file: NzUploadFile }): void {
    if (info.file.status === 'done') {
      console.log('文件处理完成');
    } else if (info.file.status === 'error') {
      console.log('文件处理失败');
    }
  }
}
