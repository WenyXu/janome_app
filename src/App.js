import React, { useState } from 'react';
import './App.modules.scss';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {fetch} from './services/fetch'
import * as Papa from 'papaparse';
import  Table from 'antd/es/table'

function App() {
  const download = ()=>{
    let head = "表層形,品詞,品詞細分類1,品詞細分類2,品詞細分類3,活用型,活用形,基本形,読み,発音\n"
    let blob = new Blob(["\uFEFF" + head+res], { type: 'text/csv;charset=utf8;' });   
    var a = document.createElement('a');
    let time = new Date();
    a.download = time.toLocaleString()+'.csv';//这里替换为你需要的文件名
    a.href = URL.createObjectURL(blob);
    a.click();
  }
  const columns = [
    {
      title: '表層形',
      dataIndex: 'd1',
      key: 'd1',
      sorter: (a, b) => a.d1.length - b.d1.length,
    },
    {
      title: '品詞',
      dataIndex: 'd2',
      key: 'd2',
      sorter: (a, b) => a.d2.length - b.d2.length,
    },
    {
      title: '品詞細分類1',
      dataIndex: 'd3',
      key: 'd3',
      sorter: (a, b) => a.d3.length - b.d3.length,
    },
    {
      title: '品詞細分類2',
      dataIndex: 'd4',
      key: 'd4',
      sorter: (a, b) => a.d4.length - b.d4.length,

    },
    {
      title: '品詞細分類3',
      dataIndex: 'd5',
      key: 'd5',
      sorter: (a, b) => a.d5.length - b.d5.length,

    },
    {
      title: '活用型',
      dataIndex: 'd6',
      key: 'd6',
      sorter: (a, b) => a.d6.length - b.d6.length,

    },
    {
      title: '活用形',
      dataIndex: 'd7',
      key: 'd7',
      sorter: (a, b) => a.d7.length - b.d7.length,
    },
    {
      title: '基本形',
      dataIndex: 'd8',
      key: 'd8',
      sorter: (a, b) => a.d8.length - b.d8.length,
    },
    {
      title: '読み',
      dataIndex: 'd9',
      key: 'd9',
      sorter: (a, b) => a.d9.length - b.d9.length,
    },
    {
      title: '発音',
      dataIndex: 'd10',
      key: 'd10',
      sorter: (a, b) => a.d10.length - b.d10.length,

    },
  ];
  const [value,setValue] = useState('吾輩は猫である')
  const [res,setRes] = useState()
  const [table,setTable] = useState([])
  const toDataSource = (d1,d2,d3,d4,d5,d6,d7,d8,d9,d10) =>{
    return {
      d1,d2,d3,d4,d5,d6,d7,d8,d9,d10
    }
  }
  const fetchData = async () =>{
    if(value===undefined || value==='')
      return
    await fetch(value).then(function (response) {
      console.log(response);
      let res = '';
      response.map((item,index)=>{
        let split = index===0?'':"\n"
        item=item.replace("\t", ",")
        res+=split+item;
      })
      //csvstring
      setRes(res)
      let json_data = Papa.parse(res)
      console.log(json_data)
      let final = json_data.data.map(item=>{
        return toDataSource(...item)
      })
      setTable(final)
      console.log(final)
    })

    console.log(value)
  }
  return (
    <div className="Wrapper">
      <Paper variant="outlined" className="Paper" >
        <TextField
            className="Textarea"
            id="outlined-multiline-static"
            label="Input"
            multiline
            rows={8}
            value={value}
            onChange={(event)=>setValue(event.target.value)}
            variant="outlined"
          />
          <Box className="ButtonBox">
            <Button size="medium" variant="outlined" color="primary"  onClick={() => fetchData()}>
              Get Result
            </Button>
            {table.length!==0&&<Button size="medium"  variant="outlined" color="secondary"  onClick={() => download()}>
              Download
            </Button>}
          </Box>
      </Paper>
      {table.length!==0 && <Paper variant="outlined" className="Paper2" >
         <Table dataSource={table} columns={columns} />
         
      </Paper>
      }
      <footer className="footer"> Copyright © 2020 CATCH ME 😊 @   <a target="_blank" href="https://terminal.im">Terminal.im</a>. Built with Create React App. </footer>
    </div>
  );
}

export default App;
