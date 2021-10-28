import { Component, OnInit } from '@angular/core'

import { Item } from './item'
import { ItemService } from './item.service'
import {encoding, File, Folder, knownFolders, path} from "@nativescript/core";
import {openFile} from "@nativescript/core/utils";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: Array<Item>

  constructor(private itemService: ItemService,
              private httpClient: HttpClient
              ) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems()
  }

  saveAndDownload(): void {
    console.time('content download:');
    this.httpClient.get('http://192.168.254.106:8887/test-4mb.pdf', { responseType: 'arraybuffer' })
      .subscribe((buffer) => {
        console.timeEnd('content download:');
            const folder: Folder = knownFolders.temp();


            let androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(
              android.os.Environment.DIRECTORY_DOWNLOADS
            ).toString();

            const filePath: string = path.join(androidDownloadsPath, 'Test.pdf');

            console.log(androidDownloadsPath);
            console.log(filePath);

            let file: File;
            try {
              file = File.fromPath(filePath);
            } catch (error) {
              console.log(error);
            }

            console.time('write time:');
            file.writeTextSync(this.convertUint8ArrayToBinaryString(new Uint8Array(buffer)), (error) => {
              console.log('File write error', error);
            }, encoding.ISO_8859_1);
            console.timeEnd('write time:');

            openFile(filePath);
      })
  }

  private arrayBufferToNSData(buffer: ArrayBuffer): NSData {
    // @ts-ignore
    const result = NSData.dataWithBytesLength(buffer, buffer.byteLength);
    return result;
  }

  private arrayBufferToByteArray(buffer: ArrayBuffer): number[] {
    const test = new Uint8Array(buffer);
    let byteArray = Array.create('byte', test.byteLength)
    for (let i = 0; i < test.length; i++) {
      byteArray[i] = new java.lang.Byte(test[i])
    }
    return byteArray;
  }

  private convertUint8ArrayToBinaryString(u8Array) {
    return u8Array.reduce((prev, current) => prev + String.fromCharCode(current), '');
  }
}
