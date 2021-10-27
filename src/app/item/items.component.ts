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
    console.log('start download');
    this.httpClient.get('http://192.168.254.106:8887/test-10mb.pdf', { responseType: 'arraybuffer' })
      .subscribe((buffer) => {
            const folder: Folder = knownFolders.temp();
            const filePath: string = path.join(folder.path, 'Test.pdf');
            let file: File;
            try {
              file = File.fromPath(filePath);
            } catch (error) {
              console.log(error);
            }

            // const data = new Uint8Array(content);
            // const binString = this.convertUint8ArrayToBinaryString(data);
            // file.writeTextSync(binString, (error) => {
            //   subscriber.error(error);
            // }, encoding.ISO_8859_1);
            console.log(filePath);
            // file.writeSync(this.arrayBufferToNSData(buffer), error => {
            //   console.log('File write error', error);
            // });

            // const data = new Uint8Array(buffer);
            // const binString = this.toBinString(data);
            console.time('write time:');
            file.writeTextSync(this.convertUint8ArrayToBinaryString(new Uint8Array(buffer)), (error) => {
              console.log('File write error', error);
            }, encoding.ISO_8859_1);
            console.timeEnd('write time:');

            openFile(filePath);
      })
      console.log('content downloaded');
    // fetch('http://www.africau.edu/images/default/sample.pdf')
    //   .then(res => res.arrayBuffer())
    //   .then((buffer) => {
    //
    //     const folder: Folder = knownFolders.temp();
    //     const filePath: string = path.join(folder.path, 'Test.pdf');
    //     let file: File;
    //     try {
    //       file = File.fromPath(filePath);
    //     } catch (error) {
    //       console.log(error);
    //     }
    //
    //     // const data = new Uint8Array(content);
    //     // const binString = this.convertUint8ArrayToBinaryString(data);
    //     // file.writeTextSync(binString, (error) => {
    //     //   subscriber.error(error);
    //     // }, encoding.ISO_8859_1);
    //
    //     file.writeSync(this.arrayBufferToByteArray(buffer), error => {
    //       console.log(error);
    //     });
    //
    //     openFile(filePath);
    //
    //   })
  }

  private arrayBufferToNSData(buffer: ArrayBuffer): NSData {
    console.log('buffer start');
    // @ts-ignore
    const result = NSData.dataWithBytesLength(buffer, buffer.byteLength);
    console.log('buffer end');
    return result;
  }

  private arrayBufferToByteArray(buffer: ArrayBuffer): number[] {
    // const result = Array.create('byte', buffer.byteLength);
    // // @ts-ignore
    // for (let i = 0; i < buffer.length; i++) {
    //   result[i] = new java.lang.Byte(buffer[i]);
    // }
    // return new Uint8Array(buffer);

    const test = new Uint8Array(buffer);
    let byteArray = Array.create('byte', test.byteLength)
    console.log('buffer start');
    for (let i = 0; i < test.length; i++) {
      byteArray[i] = new java.lang.Byte(test[i])
    }
    console.log('buffer end');
    return byteArray;
  }

  private toBinString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');

  arrayBufferToBinString(buffer: ArrayBuffer): string {
    console.log('start');
    console.time('gen time:');
    let binString;
    try {
      binString = this.convertUint8ArrayToBinaryString(new Uint8Array(buffer));
    } catch (e) {
      console.log('Error: ', e);
    }
    console.timeEnd('gen time:');
    return binString;
  }

  private convertUint8ArrayToBinaryString(u8Array) {
    // let i, len = u8Array.length, b_str = "";
    // for (i=0; i<len; i++) {
    //   b_str += String.fromCharCode(u8Array[i]);
    // }
    return u8Array.reduce((prev, current) => prev + String.fromCharCode(current), '');
  }

}
