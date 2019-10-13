import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class InterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler){
    console.log('Request on its way');
    console.log(req.url);
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz')
    });
    //return event only
    return next.handle(modifiedRequest).pipe(
      tap(event=> {
        console.log(event);
        if(event.type === HttpEventType.Response){
          console.log('Response arrived, body data:');
          console.log(event.body);
        }
      })
    );
  }
}
