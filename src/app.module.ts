import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller'; 
import { AppService } from './app.service';       
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true, // true para carregar entidades automaticamente
      synchronize: true,      // true para sincronizar tabelas em tempo real
    }),
    ProdutosModule,
  ],
  controllers: [AppController], 
  providers: [AppService],     
})
export class AppModule {}