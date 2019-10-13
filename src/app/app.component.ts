import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './posts.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';
import { NgForm, NgModelGroup } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) { }

  ngOnInit(){
    this.errorSub = this.postsService.error.subscribe(errorMessage => {
      this.isFetching = false;
      this.error = errorMessage;
    });

    this.postsService.fetchPosts()
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    });
  }  

  onCreatePost(postData: Post){
    this.postsService.createAndStorePost(postData);

  }

  onFetchPosts() {
    this.postsService.fetchPosts()
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onClearPosts() {
    this.postsService.clearPosts()
    .subscribe(() => {
      this.loadedPosts = [];
    });
  }

  onHandleError(){
    this.error = null;
  }

  fetchPosts(){
    this.postsService.fetchPosts()
    .subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
      console.log(posts);
    }, error => {
      this.error = error.message;
      console.log(error);
    });
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }

  deletePost(i: number){
    this.loadedPosts.splice(i, 1);
  }
}
