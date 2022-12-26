import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasMusicasComponent } from './listas-musicas.component';

describe('ListasMusicasComponent', () => {
  let component: ListasMusicasComponent;
  let fixture: ComponentFixture<ListasMusicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListasMusicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListasMusicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
