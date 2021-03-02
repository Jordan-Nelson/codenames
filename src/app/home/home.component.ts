import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardService } from '../board.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isPending = false;

  constructor(private boardService: BoardService, private router: Router) {}

  ngOnInit(): void {}

  createBoard(name: string) {
    name = name.trim();
    if (!name) {
      return window.alert('Please enter a board name');
    }
    this.isPending = true;
    this.boardService.createBoard(name).then((board) => {
      this.isPending = false;
      this.router.navigate(['board', board.id]);
    });
  }
}
