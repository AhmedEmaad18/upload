import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone:true,
  imports: [FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'upload';
   inputdata:string="";
   fileurl='https://api.escuelajs.co/api/v1/files/';
   uploadsnames :string []=[];
   constructor(private HttpClient:HttpClient){

   }
   uploadimage(image: any) {
    const file = image.currentTarget.files[0];

    if (file.type === 'image/png' || file.type === 'image/jpg' && file.size < 2000000) {
      const formData = new FormData();
      formData.append('file', file); // Assuming the API expects a field named 'file'

      this.HttpClient.post("https://api.escuelajs.co/api/v1/files/upload", formData)
        .subscribe(
          (res: any) => {
            console.log('Upload successful:', res);
            this.uploadsnames.push(res.filename);
            this.inputdata="";

          },
          (error: HttpErrorResponse) => {
            console.error('Upload failed:', error);
            // Handle specific error cases (e.g., display an error message to the user)
            if (error.status === 500) {
              console.error('Internal Server Error:', error.message);
            } else if (error.status === 400) {
              console.error('Bad Request:', error.message);
            }
          }
        );
    }
  }
  dowenloadfile(file:string){
  const dowenloadurl=this.fileurl+file;
  this.HttpClient.get(dowenloadurl,{responseType:'blob'}).subscribe((res:Blob)=>{
    const blob =new Blob ([res],{type:res.type});
    const url=window.URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=file;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });
  }

}
