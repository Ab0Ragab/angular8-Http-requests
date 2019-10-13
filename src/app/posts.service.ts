import { Injectable } from '@angular/core';
import { Post } from './posts.model';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(postData: Post){
    this.http
    .post('https://httprequest-e8c85.firebaseio.com/posts.json',
     postData,
     {
       observe: 'response' //by default reponse data give us the body only. observe: 'response' give us all reponse.
     }
     )
    .subscribe(resData => {
      console.log(resData);
  }, error => {
    this.error.next(error.message);
  });
 }

 fetchPosts(){
  let searchParams = new HttpParams();
  searchParams = searchParams.append('print', 'pretty'); //make response look good
  searchParams = searchParams.append('custom', 'key'); 
  return this.http
  .get<Post>('https://httprequest-e8c85.firebaseio.com/posts.json',
  {
    headers: new HttpHeaders({'custom-header': 'Hello'}),
    params: searchParams
    //params: new HttpParams().set('print', 'pretty')
  })
  .pipe(
    map(responseData=> {
     const postsArray: Post[] = [];
     console.log(responseData); //before map
     console.log(postsArray); //after map
     for(const key in responseData){
       if(responseData.hasOwnProperty(key)) {
         postsArray.push({ ...responseData[key], id: key });
       }
     }
     return postsArray;
  }),
   catchError(errorRes => {
      return throwError(errorRes);
   })
  );
  
 }

 clearPosts(){
  return this.http.delete('https://httprequest-e8c85.firebaseio.com/posts.json',
  {
    observe: 'events', //manage response data 
    responseType: 'text' //change type of response data body
  }).pipe(
     tap(event => {
       console.log(event);
       if(event.type == HttpEventType.Sent){
         console.log('Deleted');
       }
     })
    );
 }

}
