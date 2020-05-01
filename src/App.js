import React, { useState } from 'react';
import './App.modules.scss';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {fetch} from './services/fetch'
import * as Papa from 'papaparse';
import  Table from 'antd/es/table'
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

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
      ellipsis: true,
    },
    {
      title: '品詞',
      dataIndex: 'd2',
      key: 'd2',
      ellipsis: true,
      filters: [
        { text: '名詞', value: '名詞' },
        { text: '動詞', value: '動詞' },
      ],
      onFilter: (value, record) => record.d2.indexOf(value) === 0,

    },
    {
      title: '品詞細分類1',
      dataIndex: 'd3',
      key: 'd3',
      sorter: (a, b) => a.d3.length - b.d3.length,
      ellipsis: true,
    },
    {
      title: '品詞細分類2',
      dataIndex: 'd4',
      key: 'd4',
      sorter: (a, b) => a.d4.length - b.d4.length,
      ellipsis: true,

    },
    {
      title: '品詞細分類3',
      dataIndex: 'd5',
      key: 'd5',
      sorter: (a, b) => a.d5.length - b.d5.length,
      ellipsis: true,

    },
    {
      title: '活用型',
      dataIndex: 'd6',
      key: 'd6',
      sorter: (a, b) => a.d6.length - b.d6.length,
      ellipsis: true,

    },
    {
      title: '活用形',
      dataIndex: 'd7',
      key: 'd7',
      sorter: (a, b) => a.d7.length - b.d7.length,
      ellipsis: true,

    },
    {
      title: '基本形',
      dataIndex: 'd8',
      key: 'd8',
      sorter: (a, b) => a.d8.length - b.d8.length,
      ellipsis: true,

    },
    {
      title: '読み',
      dataIndex: 'd9',
      key: 'd9',
      sorter: (a, b) => a.d9.length - b.d9.length,
      ellipsis: true,

    },
    {
      title: '発音',
      dataIndex: 'd10',
      key: 'd10',
      sorter: (a, b) => a.d10.length - b.d10.length,
      ellipsis: true,

    },
  ];
  const [value,setValue] = useState('吾輩は猫である')
  const [res,setRes] = useState()
  const [table,setTable] = useState([])
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();
  const classes = useStyles();

  const toDataSource = (d1,d2,d3,d4,d5,d6,d7,d8,d9,d10) =>{
    return {
      d1,d2,d3,d4,d5,d6,d7,d8,d9,d10
    }
  }
  const fetchData = async () =>{
    if(loading)
      return 
    if(value===undefined || value==='')
      return
    setSuccess(false)
    setLoading(true);
    await fetch(value).then(function (response) {
      console.log(response);
      let res = '';
      response && response.length!==0 && response.map((item,index)=>{
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
      setSuccess(true)
      setLoading(false);
    }).catch(()=>{
      setSuccess(false)
      setLoading(false);
    })

    console.log(value)
  }
  const handleButtonClick = () => {
    
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
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
              <div className={classes.wrapper}>
            <Fab
              aria-label="save"
              color="primary"
              className={buttonClassname}
              onClick={fetchData}
            >
              {success ? <CheckIcon /> : <PlayArrowIcon />}
            </Fab>
            {loading && <CircularProgress size={68} className={classes.fabProgress} />}
          </div>
            
            {table.length!==0&&<Button size="medium"  variant="outlined" color="secondary"  onClick={() => download()}>
              Download
            </Button>}
          </Box>
      </Paper>
      {table.length!==0 && <Paper variant="outlined" className="Paper2" >
         <Table dataSource={table} columns={columns} />
         
      </Paper>
      }
      <footer className="footer"> 
      <div>
      Copyright © 2020 CATCH ME @ 😊 <a target="_blank" href="https://terminal.im">Terminal.im</a>. Built with <a target="_blank" href="https://github.com/facebook/create-react-app">Create React App</a>.
      <div>
        Source Code:<a  target="_blank" href="https://github.com/WenyXu/janome_be">BE</a>,<a href="https://github.com/WenyXu/janome_app" target="_blank">FE</a>. We are using Serverless,The Backend running in GCP Cloud Functions.
      </div>
      </div>  
      
      
      
      </footer>
    </div>
  );
}

export default App;
